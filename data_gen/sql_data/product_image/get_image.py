# Get random unsplashed image
import os
import requests
import random
import hashlib

API_KEY = 'iObEck3rDzyG2_LrmAnlRqnoUMiuy36XRPWZQk1edLg'
# URL for the Unsplash API endpoint to fetch a random image
URL = f'https://api.unsplash.com/photos/random/?client_id={API_KEY}'
# File path to save the URLs
OUTPUT_FILE = 'random_image_urls.txt'
UNIQUE_FILE = 'unique.txt'

# Limit is 50 per hour
def get_image(num_images=50):
    # write mode
    if os.path.exists(OUTPUT_FILE):
        append_write = 'a' # append if already exists
    else:
        append_write = 'w' # make a new file if not
    try:
        with open(OUTPUT_FILE, append_write) as file:
            for _ in range(num_images):
                # Make a GET request to the Unsplash API
                response = requests.get(URL)

                # Check if the request was successful (status code 200)
                if response.status_code == 200:
                    # Parse the JSON response to get the image URL
                    data = response.json()
                    image_url = data['urls']['regular']

                    # Write the URL to the file
                    file.write(image_url + '\n')
                else:
                    print(f'Error: Unable to fetch a random image. Status Code: {response.status_code}')
    except Exception as e:
        print(f'An error occurred: {str(e)}')
        
    print(f'Image URLs have been saved to {OUTPUT_FILE}')

# check for duplicate images just in case
def check_duplicate():
    completed_lines_hash = set()
    input_file = open(OUTPUT_FILE, "r")
    output_file = open(UNIQUE_FILE, "w")
    
    for line in input_file:
        hashValue = hashlib.md5(line.rstrip().encode('utf-8')).hexdigest()
        if hashValue not in completed_lines_hash:
            output_file.write(line)
            completed_lines_hash.add(hashValue)
    
    output_file.close()
    input_file.close()
    print(f"Duplicate check completed: You have {len(completed_lines_hash)} unique values.")

get_image()
check_duplicate()