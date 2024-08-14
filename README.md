# Imersão Full Cycle 18

This repository contains the source code and materials for the **Imersão Full Cycle 18** event.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Architecture](#architecture)

## Project Overview

This project demonstrates a microservices architecture for a ticket-selling platform. It features a Next.js frontend, a Golang API for handling ticket sales, and NestJS services that simulate potential ticket-selling partners. Kong is utilized as the API Gateway to manage and secure API traffic..

## Prerequisites

Ensure the following tools are installed on your system before proceeding:

- Docker
- Docker Compose

## Getting Started

### Clone the Repository

Start by cloning the repository:

```bash
git clone https://github.com/mwives/fullcycle-imersao-18.git
cd fullcycle-imersao-18
```

### Run the Services

To start all services, use Docker Compose:

Use Docker Compose to start the services:

```bash
docker-compose up --build
```

### Load Data Fixtures

Once the services are up, load the database fixtures:

```bash
docker-compose exec nestjs pnpm fixture:partner1
docker-compose exec nestjs pnpm fixture:partner2
```

### Access the Application

After everything is running, you can access the services through the following URLs:

- Next.js Frontend: http://localhost:8000/nextjs
- Golang API: http://localhost:8000/golang
- NestJS Partner1: http://localhost:8000/partner1
- NestJS Partner2: http://localhost:8000/partner2

## Architecture

The project is built using a microservices architecture, with the following components:

- Golang API: Core ticket-selling API
- Next.js Frontend: User-facing application
- NestJS Services (Partner1/Partner2): Simulated external partners for ticket sales
- Kong API Gateway: Centralized API management and traffic control
