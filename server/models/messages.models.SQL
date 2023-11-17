CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id INT REFERENCES chats(id),
  type VARCHAR(255),
  message TEXT,
  saved BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);                                                                                                           