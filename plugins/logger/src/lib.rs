use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize)]
pub struct LogEntry {
    timestamp: DateTime<Utc>,
    level: String,
    message: String,
    metadata: Option<String>,
}

#[wasm_bindgen]
pub struct Logger {
    entries: Vec<LogEntry>,
    max_entries: usize,
}

#[wasm_bindgen]
impl Logger {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Logger {
        Logger {
            entries: Vec::new(),
            max_entries: 1000,
        }
    }

    pub fn info(&mut self, message: &str) {
        self.log("INFO", message, None);
    }

    pub fn warn(&mut self, message: &str) {
        self.log("WARN", message, None);
    }

    pub fn error(&mut self, message: &str) {
        self.log("ERROR", message, None);
    }

    pub fn debug(&mut self, message: &str, metadata: &str) {
        self.log("DEBUG", message, Some(metadata.to_string()));
    }

    fn log(&mut self, level: &str, message: &str, metadata: Option<String>) {
        let entry = LogEntry {
            timestamp: Utc::now(),
            level: level.to_string(),
            message: message.to_string(),
            metadata,
        };

        self.entries.push(entry);
        if self.entries.len() > self.max_entries {
            self.entries.remove(0);
        }
    }

    pub fn get_logs(&self) -> String {
        serde_json::to_string(&self.entries).unwrap_or_else(|_| "[]".to_string())
    }

    pub fn clear(&mut self) {
        self.entries.clear();
    }
}