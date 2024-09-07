import os
import json

def list_files(start_directory, extensions, lyrics_directory, covers_directory, dates_directory, additional_info_directory):
    matching_files = []

    for root, dirs, files in os.walk(start_directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                author = os.path.basename(os.path.dirname(file_path))
                title = os.path.splitext(file)[0]
                file_name = f"{author} - {title}"

                cover_path = os.path.join(covers_directory, author, f"{title}.jpg")
                lyrics_path = os.path.join(lyrics_directory, author, f"{title}.txt")
                date_path = os.path.join(dates_directory, author, f"{title}.txt")
                additional_info_path = os.path.join(additional_info_directory, author, f"{title}.txt")
                
                matching_files.append({
                    "name": file_name,
                    "path": file_path,
                    "lyrics": lyrics_path,
                    "cover": cover_path,
                    "date": date_path,
                    "additionalInfo": additional_info_path
                })

    matching_files.sort(key=lambda x: x['name'])

    return matching_files

def update_json_file(json_file, data):
    with open(json_file, 'w') as f:
        json.dump(data, f, indent=4)

start_directory = 'music'
extensions = ['.wav', '.flac']
lyrics_directory = 'lyrics'
covers_directory = 'covers'
dates_directory = 'dates'
additional_info_directory = 'additional_info'
json_file = 'music.json'

files = list_files(start_directory, extensions, lyrics_directory, covers_directory, dates_directory, additional_info_directory)
update_json_file(json_file, files)
print(f'{len(files)} files.')
