use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use regex::Regex;

#[wasm_bindgen]
pub struct Validator {
    email_regex: Regex,
    url_regex: Regex,
}

#[wasm_bindgen]
impl Validator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Validator {
        Validator {
            email_regex: Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap(),
            url_regex: Regex::new(r"^https?://[\w\-]+(\.[\w\-]+)+[/#?]?.*$").unwrap(),
        }
    }

    pub fn validate_email(&self, email: &str) -> bool {
        self.email_regex.is_match(email)
    }

    pub fn validate_url(&self, url: &str) -> bool {
        self.url_regex.is_match(url)
    }

    pub fn validate_json(&self, json_str: &str) -> bool {
        serde_json::from_str::<Value>(json_str).is_ok()
    }

    pub fn validate_length(&self, text: &str, min: usize, max: usize) -> bool {
        let len = text.len();
        len >= min && len <= max
    }

    pub fn validate_numeric(&self, text: &str) -> bool {
        text.parse::<f64>().is_ok()
    }

    pub fn validate_alphanumeric(&self, text: &str) -> bool {
        text.chars().all(|c| c.is_alphanumeric())
    }
}