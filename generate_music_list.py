import os
import json

def list_files(start_directory, extensions):
    matching_files = []
    
    for root, dirs, files in os.walk(start_directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                matching_files.append(os.path.join(root, file))
    
    return matching_files

def update_json_file(json_file, data):
    with open(json_file, 'w') as f:
        json.dump(data, f, indent=4)

start_directory = '/music'
extensions = ['.wav', '.flac']
json_file = 'music.json'

files = list_files(start_directory, extensions)
update_json_file(json_file, files)
print(f'Fichier JSON mis à jour avec {len(files)} fichiers.')
