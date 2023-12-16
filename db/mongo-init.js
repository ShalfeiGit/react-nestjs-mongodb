db.createUser(
        {
            user: "dbUser",
            pwd: "dbUser",
            roles: [
                {
                    role: "readWrite",
                    db: "dbReact"
                }
            ]
        }
);