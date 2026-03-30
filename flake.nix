{
  description = "A development environment for uic-918-3";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            pnpm
            # emscripten
            # asn1c
            # bash
          ];

          shellHook = ''
            echo "uic-918-3 development environment loaded"
            node --version
            pnpm --version
          '';
        };
      }
    );
}
