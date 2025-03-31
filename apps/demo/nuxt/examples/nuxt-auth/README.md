# Nuxt Auth Example with OAuth (GitHub Provider)

## Overview

This example demonstrates OAuth authentication implementation in Nuxt 3 using GitHub as the authentication provider. Please note that this example cannot run in WebContainers due to OAuth authentication requirements.

## Why it doesn't work in WebContainers

WebContainers have limitations with OAuth flows because:

- OAuth requires real HTTP callbacks
- WebContainers run in an isolated environment
- OAuth providers need valid redirect URIs
- GitHub OAuth apps require registered callback URLs

## Features

- OAuth authentication flow with GitHub
- Protected routes
- Login/logout functionality
- Session management
- GitHub user authentication

## Setup

1. Clone the repository
2. Install dependencies:
3. Run on localhost:3000