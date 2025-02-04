use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json::json;

#[derive(Serialize, Deserialize)]
struct User {
    username: String,
    role: String,
    token: String,
}

#[wasm_bindgen]
pub struct Auth {
    current_user: Option<User>,
    users: Vec<User>,
}

#[wasm_bindgen]
impl Auth {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Auth {
        Auth {
            current_user: None,
            users: vec![
                User {
                    username: "admin".to_string(),
                    role: "admin".to_string(),
                    token: "admin-token".to_string(),
                },
                User {
                    username: "user".to_string(),
                    role: "user".to_string(),
                    token: "user-token".to_string(),
                },
            ],
        }
    }

    pub fn login(&mut self, username: &str, password: &str) -> String {
        // Demo authentication - in real plugin, implement proper auth
        let user = self.users.iter().find(|u| u.username == username);
        
        match user {
            Some(user) => {
                self.current_user = Some(User {
                    username: user.username.clone(),
                    role: user.role.clone(),
                    token: user.token.clone(),
                });
                json!({
                    "success": true,
                    "token": user.token,
                    "role": user.role
                }).to_string()
            }
            None => json!({
                "success": false,
                "error": "Invalid credentials"
            }).to_string()
        }
    }

    pub fn verify_token(&self, token: &str) -> bool {
        self.current_user.as_ref().map_or(false, |u| u.token == token)
    }

    pub fn get_user_role(&self) -> String {
        self.current_user.as_ref().map_or("guest".to_string(), |u| u.role.clone())
    }

    pub fn logout(&mut self) {
        self.current_user = None;
    }
}