# TaskCollab
The goal is to develop a scalable, feature-rich system for managing tasks in a team environment. This system focuses on enhancing team collaboration, task tracking, and ensuring secure and role-based accessibility for team members and administrators.

Tech Stack

Languages: JavaScript, Java, TypeScript
Frameworks: React, SpringBoot, socket.io
Database: PostgreSQL/SQL Server
Testing Tools: Junit, Jest/Cypress


Recomended IDE: VS Code

## Build and Run Instructions

To build and run the application, please ensure you have Docker and Docker Compose installed and running on your system. Follow these steps:

1.  **Verify Docker is Running:**
    * Confirm that Docker is actively running on your machine. You can typically check this through your system tray or by running `docker ps` in your terminal.

2.  **Navigate to the Project Directory:**
    * Open your terminal and navigate to the root directory of the project where the `docker-compose.yml` file is located.

3.  **Build and Start the Application:**
    * Execute the following command in your terminal:

        ```bash
        docker-compose up --build
        ```

    * This command will build the Docker images defined in your `docker-compose.yml` file and then start the containers.

4.  **Access the Application:**
    * Once the containers are running, open your web browser and navigate to `http://localhost:3000`.

    * You should now be able to access and use the application.

**Note:**

* The `--build` flag ensures that Docker rebuilds the images if any changes have been made to the Dockerfiles.
* If you need to stop the application, you can run `docker-compose down` in the same directory.
