#!/usr/bin/env bash

set -eu

function install_wasm_target() {
    rustup target add wasm32-unknown-unknown
}

function install_wasm2wat() {
    cd /tmp
    git clone https://github.com/WebAssembly/wabt
    cd /tmp/wabt/
    cmake -DBUILD_TESTS=OFF -DCMAKE_BUILD_TYPE=Release
    make wasm2wat
    cp ./wasm2wat $HOME/.cargo/bin
    rm -rf /tmp/wabt/
}

function install_wasm_gc() {
    cargo install wasm-gc
}

(install_wasm_target)
(install_wasm2wat)
(install_wasm_gc)
