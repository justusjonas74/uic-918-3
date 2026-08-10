{
  description = "A development environment for uic-918-3";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable"; # Unstable
    utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
        asn1c-patched = pkgs.asn1c.overrideAttrs (oldAttrs: {
          pname = "asn1c";
          version = "1.0.0";
          src = pkgs.fetchFromGitHub {
            owner = "mouse07410";
            repo = "asn1c";
            rev = "165e8504bb61e229349ade814cc0a192bb86dc8d";
            hash = "sha256-74OMwNXwDLPw5BcxQCUd9itRRLvod5nNScibyp/ZQa4=";
          };
          nativeBuildInputs = (oldAttrs.nativeBuildInputs or [ ]) ++ [
            pkgs.bison
            pkgs.flex
          ];
        });
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            pnpm
            emscripten
            asn1c-patched
            bash
          ];

          shellHook = ''
            echo "Nix based development environment loaded."
            pnpm --version
            export PNPM_HOME="$HOME/.local/share/pnpm"
            export PATH="$PNPM_HOME:$PATH"
          '';
        };
      }
    );
}
