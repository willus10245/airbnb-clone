#! /bin/bash
yarn build:web
netlify deploy -d ./packages/web/build -p

# Site Created

# Admin URL: https://app.netlify.com/sites/laughing-roentgen-9e79bf
# URL:       https://laughing-roentgen-9e79bf.netlify.com
# Site ID:   09065a7d-33d4-49e5-8810-299f691c3ff5