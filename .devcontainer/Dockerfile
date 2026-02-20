FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
        build-essential \
        cmake \
        git \
        python3 \
        python3-pip \
        clang \
        asn1c \
        curl && \
    rm -rf /var/lib/apt/lists/*

# Install Emscripten
ENV EMSDK=/opt/emsdk
RUN git clone https://github.com/emscripten-core/emsdk.git $EMSDK && \
    cd $EMSDK && \
    ./emsdk install latest && \
    ./emsdk activate latest

# Add Emscripten to PATH
ENV PATH="$EMSDK:$EMSDK/upstream/emscripten:$PATH"

# Source emsdk environment automatically
RUN echo 'source /opt/emsdk/emsdk_env.sh > /dev/null 2>&1' >> /etc/bash.bashrc
