#!/bin/bash
set -e

echo "Installing asn1c..."
sudo apt-get update
sudo apt-get install -y asn1c

echo "Setting up Emscripten..."
git clone https://github.com/emscripten-core/emsdk.git ~/emsdk
cd ~/emsdk
./emsdk install latest
./emsdk activate latest
echo 'source ~/emsdk/emsdk_env.sh' >> ~/.bashrc

echo "Installing npm dependencies..."
npm ci

echo "Setup complete!"