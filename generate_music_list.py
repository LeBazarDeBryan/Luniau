import os
import json

def list_files(start_directory, extensions, lyrics_base_directory):
    matching_files = []
    
    for root, dirs, files in os.walk(start_directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                author = os.path.basename(os.path.dirname(file_path))
                title = os.path.splitext(file)[0]
                file_name = f"{author} - {title}"

                lyrics_file_path = os.path.join(lyrics_base_directory, author, f"{title}.txt")
                lyrics = ""
                
                if os.path.exists(lyrics_file_path):
                    with open(lyrics_file_path, 'r') as lyrics_file:
                        lyrics = lyrics_file.read()

                matching_files.append({
                    "name": file_name,
                    "path": file_path,
                    "lyrics": lyrics
                })
    
    matching_files.sort(key=lambda x: x['name'])
    
    return matching_files

def update_json_file(json_file, data):
    with open(json_file, 'w') as f:
        json.dump(data, f, indent=4)

start_directory = 'music'
extensions = ['.wav', '.flac']
lyrics_base_directory = 'lyrics'
json_file = 'music.json'

files = list_files(start_directory, extensions, lyrics_base_directory)
update_json_file(json_file, files)
print(f'Fichier JSON mis à jour avec {len(files)} fichiers.')
