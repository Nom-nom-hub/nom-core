use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use regex::Regex;

#[derive(Serialize)]
struct ValidationEvent {
    field: String,
    valid: bool,
    message: String,
}

#[wasm_bindgen]
pub struct Validator {
    email_regex: Regex,
    url_regex: Regex,
    callback: Option<js_sys::Function>,
}

#[wasm_bindgen]
impl Validator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Validator {
        Validator {
            email_regex: Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap(),
            url_regex: Regex::new(r"^https?://[\w\-]+(\.[\w\-]+)+[/#?]?.*$").unwrap(),
            callback: None,
        }
    }

    #[wasm_bindgen]
    pub fn on(&mut self, callback: js_sys::Function) {
        self.callback = Some(callback);
    }

    fn emit(&self, event: ValidationEvent) {
        if let Some(callback) = &self.callback {
            let event_json = serde_json::to_string(&event).unwrap();
            let _ = callback.call1(&JsValue::NULL, &JsValue::from_str(&event_json));
        }
    }

    pub fn validate_email(&self, email: &str) -> bool {
        let valid = self.email_regex.is_match(email);
        self.emit(ValidationEvent {
            field: "email".to_string(),
            valid,
            message: if valid { "Valid email".to_string() } else { "Invalid email format".to_string() },
        });
        valid
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