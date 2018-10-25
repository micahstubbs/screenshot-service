# install nodejs v8.12.0
# How To Install Using a PPA 
# https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04
curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs
nodejs -v
# v8.12.0

# install missing dependencies for Chrome
# https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md
sudo apt-get install gconf-service
sudo apt-get install libasound2
sudo apt-get install libatk1.0-0
sudo apt-get install libatk-bridge2.0-0
sudo apt-get install libc6
sudo apt-get install libcairo2
sudo apt-get install libcups2
sudo apt-get install libdbus-1-3
sudo apt-get install libexpat1
sudo apt-get install libfontconfig1
sudo apt-get install libgcc1
sudo apt-get install libgconf-2-4
sudo apt-get install libgdk-pixbuf2.0-0
sudo apt-get install libglib2.0-0
sudo apt-get install libgtk-3-0
sudo apt-get install libnspr4
sudo apt-get install libpango-1.0-0
sudo apt-get install libpangocairo-1.0-0
sudo apt-get install libstdc++6
sudo apt-get install libx11-6
sudo apt-get install libx11-xcb1
sudo apt-get install libxcb1
sudo apt-get install libxcomposite1
sudo apt-get install libxcursor1
sudo apt-get install libxdamage1
sudo apt-get install libxext6
sudo apt-get install libxfixes3
sudo apt-get install libxi6
sudo apt-get install libxrandr2
sudo apt-get install libxrender1
sudo apt-get install libxss1
sudo apt-get install libxtst6
sudo apt-get install ca-certificates
sudo apt-get install fonts-liberation
sudo apt-get install libappindicator1
sudo apt-get install libnss3
sudo apt-get install lsb-release
sudo apt-get install xdg-utils
sudo apt-get install wget
