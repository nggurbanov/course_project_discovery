#!/usr/bin/env python3
"""
Data processing script for Project Discovery Platform.
Parses CSV data and enriches it with AI-generated thematic tags using Gemini API.
"""

import os
import json
import pandas as pd
import requests
import asyncio
import aiohttp
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# DeepInfra API configuration
DEEPINFRA_API_KEY = os.getenv('DEEPINFRA_API_KEY')
DEEPINFRA_URL = "https://api.deepinfra.com/v1/openai/chat/completions"

# Master list of thematic tags
MASTER_TAGS = [
    "Искусственный интеллект", "Машинное обучение", "Глубокое обучение", "LLM", "NLP",
    "Компьютерное зрение", "Обработка изображений", "Анализ данных", "Визуализация данных",
    "Веб-разработка", "Мобильная разработка", "Игровая разработка", "Видеоигры",
    "Кибербезопасность", "Блокчейн", "Криптография", "Квантовые вычисления",
    "Медицина", "Биоинформатика", "Здоровье", "Финансы", "Банкинг", "Торговля",
    "Образование", "E-learning", "Социальные сети", "Коммуникации",
    "Интернет вещей", "IoT", "Робототехника", "Автоматизация",
    "Энергетика", "Экология", "Устойчивое развитие", "Климат",
    "Транспорт", "Логистика", "Геолокация", "Карты",
    "Музыка", "Аудио", "Видео", "Мультимедиа",
    "Психология", "Поведение", "UX/UI", "Дизайн",
    "Лингвистика", "Перевод", "Текст", "Документы",
    "Архитектура", "Инфраструктура", "Облачные вычисления", "DevOps"
]

async def extract_tags_async(session: aiohttp.ClientSession, project_title_ru: str, project_annotation: str) -> tuple[str, List[str]]:
    """
    Async function to extract tags from a single project using DeepInfra API.
    Returns (project_title, tags_list) for error tracking.
    """
    prompt = f"""
    Проанализируй следующий проект и определи 2-5 наиболее подходящих тематических тегов из предоставленного списка.
    
    Название проекта: {project_title_ru}
    Аннотация: {project_annotation}
    
    Доступные теги: {', '.join(MASTER_TAGS)}
    
    Верни только список тегов через запятую, без дополнительных объяснений.
    """
    
    try:
        headers = {
            "Authorization": f"Bearer {DEEPINFRA_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "google/gemma-3-27b-it",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 200,
            "temperature": 0.3
        }
        
        async with session.post(DEEPINFRA_URL, headers=headers, json=payload, timeout=30) as response:
            if response.status == 429:
                print(f"Rate limited for project '{project_title_ru}', retrying...")
                await asyncio.sleep(1)
                return await extract_tags_async(session, project_title_ru, project_annotation)
            
            response.raise_for_status()
            result = await response.json()
            tags_text = result['choices'][0]['message']['content'].strip()
            
            # Parse the response and filter to only include valid tags
            suggested_tags = [tag.strip() for tag in tags_text.split(',')]
            valid_tags = [tag for tag in suggested_tags if tag in MASTER_TAGS]
            return (project_title_ru, valid_tags[:5])  # Limit to 5 tags max
            
    except Exception as e:
        print(f"Error generating tags for project '{project_title_ru}': {e}")
        return (project_title_ru, [])

async def process_batch_async(projects_batch: List[Dict], batch_num: int, total_batches: int) -> List[Dict]:
    """
    Process a batch of projects concurrently using asyncio.
    """
    print(f"Processing batch {batch_num}/{total_batches} with {len(projects_batch)} projects...")
    
    async with aiohttp.ClientSession() as session:
        # Create tasks for all projects in the batch
        tasks = []
        for project_data in projects_batch:
            task = extract_tags_async(
                session, 
                project_data['title_ru'], 
                project_data['annotation']
            )
            tasks.append(task)
        
        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        processed_projects = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"Error processing project {i}: {result}")
                # Use original project data with empty tags
                project = projects_batch[i].copy()
                project['tags'] = []
                processed_projects.append(project)
            else:
                project_title, tags = result
                # Find the corresponding project and update it
                for project_data in projects_batch:
                    if project_data['title_ru'] == project_title:
                        project = project_data.copy()
                        project['tags'] = tags
                        processed_projects.append(project)
                        break
        
        return processed_projects

def load_existing_data(output_path: str) -> Dict[str, Any]:
    """
    Load existing data if it exists, otherwise return empty structure.
    """
    if os.path.exists(output_path):
        try:
            with open(output_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Extract processed_ids from existing projects
            processed_ids = set()
            if "projects" in data:
                for project in data["projects"]:
                    if "id" in project:
                        processed_ids.add(project["id"])
            
            # Convert tags to set if it's a list
            tags = data.get("tags", [])
            if isinstance(tags, list):
                tags = set(tags)
            
            # Convert supervisors to dict if it's a list
            supervisors = data.get("supervisors", {})
            if isinstance(supervisors, list):
                supervisors = {s["name"]: s for s in supervisors}
            
            return {
                "projects": data.get("projects", []),
                "supervisors": supervisors,
                "tags": tags,
                "processed_ids": processed_ids,
                "metadata": data.get("metadata", {})
            }
        except Exception as e:
            print(f"Error loading existing data: {e}")
            pass
    
    return {
        "projects": [],
        "supervisors": {},
        "tags": set(),
        "processed_ids": set(),
        "metadata": {
            "total_projects": 0,
            "total_supervisors": 0,
            "total_tags": 0
        }
    }

def save_progress(data: Dict[str, Any], output_path: str):
    """
    Save current progress to JSON file.
    """
    # Convert set to list for JSON serialization
    save_data = {
        "projects": data["projects"],
        "supervisors": list(data["supervisors"].values()) if isinstance(data["supervisors"], dict) else data["supervisors"],
        "tags": sorted(list(data["tags"])),
        "metadata": {
            "total_projects": len(data["projects"]),
            "total_supervisors": len(data["supervisors"]) if isinstance(data["supervisors"], dict) else len(data["supervisors"]),
            "total_tags": len(data["tags"])
        }
    }
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(save_data, f, ensure_ascii=False, indent=2)

async def process_csv_data_async(csv_path: str, output_path: str) -> Dict[str, Any]:
    """
    Process the CSV file with concurrent batches and return structured data.
    """
    print(f"Reading CSV file: {csv_path}")
    
    # Read CSV with proper encoding for Cyrillic text
    df = pd.read_csv(csv_path, sep=';', encoding='utf-8')
    
    print(f"Found {len(df)} projects in CSV")
    
    # Load existing data
    data = load_existing_data(output_path)
    projects = data["projects"]
    supervisors = data["supervisors"] if isinstance(data["supervisors"], dict) else {s["name"]: s for s in data["supervisors"]}
    all_tags = data["tags"] if isinstance(data["tags"], set) else set(data["tags"])
    processed_ids = data.get("processed_ids", set())
    
    print(f"Found {len(processed_ids)} already processed projects")
    print(f"Existing projects: {len(projects)}")
    print(f"Existing supervisors: {len(supervisors)}")
    print(f"Existing tags: {len(all_tags)}")
    
    if processed_ids:
        print(f"Sample processed IDs: {list(processed_ids)[:5]}")
    
    # Prepare projects to process
    projects_to_process = []
    for idx, row in df.iterrows():
        project_id = f"project_{idx}"
        
        # Skip if already processed
        if project_id in processed_ids:
            continue
            
        # Skip rows with missing essential data
        if pd.isna(row.get('Наименование проекта на русском')):
            continue
            
        # Get courses that this project is offered for
        courses = []
        for col in df.columns:
            if 'курс' in col.lower() and str(row[col]).lower() == 'да':
                courses.append(col)
        
        project_data = {
            "id": project_id,
            "title_ru": str(row.get('Наименование проекта на русском', '')),
            "title_en": str(row.get('Наименование проекта на английском', '')),
            "supervisor": str(row.get('ФИО руководителя', '')),
            "co_supervisor": str(row.get('ФИО соруководителя', '')) if pd.notna(row.get('ФИО соруководителя')) else '',
            "annotation": str(row.get('Аннотация проекта', '')),
            "goals": str(row.get('Цель проекта', '')),
            "tasks": str(row.get('Задачи проекта', '')),
            "requirements": str(row.get('Требования, предъявляемые к студентам', '')),
            "type": str(row.get('Тип проекта', '')),
            "format": str(row.get('Вид проекта', '')),
            "courses": courses,
            "contact": str(row.get('Контактная почта соруководителя', '')) if pd.notna(row.get('Контактная почта соруководителя')) else '',
            "team_size": str(row.get('Предполагаемое кол-во студентов на проекте', '')),
            "selection_form": str(row.get('Форма отбора на проект', '')),
            "preferred_contact": str(row.get('Предпочтительный способ связи', '')),
            "video_link": str(row.get('Ссылка на видео-ролик проекта', '')) if pd.notna(row.get('Ссылка на видео-ролик проекта')) else '',
            "presentation_link": str(row.get('Ссылка на презентацию проекта', '')) if pd.notna(row.get('Ссылка на презентацию проекта')) else ''
        }
        
        projects_to_process.append(project_data)
    
    print(f"Processing {len(projects_to_process)} new projects in batches of 200...")
    
    # Process in batches of 200 (DeepInfra's concurrent limit)
    batch_size = 200
    total_batches = (len(projects_to_process) + batch_size - 1) // batch_size
    
    for i in range(0, len(projects_to_process), batch_size):
        batch = projects_to_process[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        
        # Process batch concurrently
        processed_batch = await process_batch_async(batch, batch_num, total_batches)
        
        # Add processed projects to main list
        for project in processed_batch:
            projects.append(project)
            processed_ids.add(project['id'])
            all_tags.update(project['tags'])
            
            # Track supervisors
            supervisor_name = project["supervisor"]
            if supervisor_name and supervisor_name != 'nan':
                if supervisor_name not in supervisors:
                    supervisors[supervisor_name] = {
                        "id": f"supervisor_{len(supervisors)}",
                        "name": supervisor_name,
                        "projects": []
                    }
                supervisors[supervisor_name]["projects"].append(project['id'])
        
        # Save progress after each batch
        print(f"Saving progress after batch {batch_num}/{total_batches}...")
        save_progress({
            "projects": projects,
            "supervisors": supervisors,
            "tags": all_tags,
            "processed_ids": processed_ids
        }, output_path)
    
    return {
        "projects": projects,
        "supervisors": list(supervisors.values()),
        "tags": sorted(list(all_tags)),
        "metadata": {
            "total_projects": len(projects),
            "total_supervisors": len(supervisors),
            "total_tags": len(all_tags)
        }
    }

async def main_async():
    """
    Main async function to process the data and generate JSON output.
    """
    csv_path = "/Users/tyrell/Documents/coursework_projects_web/темы проектов.csv"
    output_path = "/Users/tyrell/Documents/coursework_projects_web/src/data/projects.json"
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return
    
    # Check for API key
    if not DEEPINFRA_API_KEY:
        print("Error: DEEPINFRA_API_KEY environment variable not set")
        print("Please create a .env file with your DeepInfra API key")
        return
    
    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    try:
        # Process the data with concurrent batches
        data = await process_csv_data_async(csv_path, output_path)
        
        # Final save
        save_progress({
            "projects": data["projects"],
            "supervisors": {s["name"]: s for s in data["supervisors"]},
            "tags": set(data["tags"]),
            "processed_ids": set()  # All processed at this point
        }, output_path)
        
        print(f"\nData processing complete!")
        print(f"Generated {data['metadata']['total_projects']} projects")
        print(f"Found {data['metadata']['total_supervisors']} supervisors")
        print(f"Generated {data['metadata']['total_tags']} unique tags")
        print(f"Output saved to: {output_path}")
        
    except KeyboardInterrupt:
        print(f"\nProcessing interrupted by user. Progress saved to: {output_path}")
        print("You can resume processing by running the script again.")
    except Exception as e:
        print(f"\nError during processing: {e}")
        print(f"Progress saved to: {output_path}")
        print("You can resume processing by running the script again.")

def main():
    """
    Main function to run the async processing.
    """
    asyncio.run(main_async())

if __name__ == "__main__":
    main()
