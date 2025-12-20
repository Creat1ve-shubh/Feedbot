import torch
import torch.nn as nn
from transformers import AutoModel

class TransformerLSTM(nn.Module):
    def __init__(self, transformer_name="distilbert-base-uncased", hidden_size=256, num_labels=2):
        super().__init__()

        self.transformer = AutoModel.from_pretrained(transformer_name)
        self.lstm = nn.LSTM(
            input_size=self.transformer.config.hidden_size,
            hidden_size=hidden_size,
            batch_first=True,
            num_layers=1,
            bidirectional=True,
        )
        self.dropout = nn.Dropout(0.3)
        self.classifier = nn.Linear(hidden_size * 2, num_labels)

    def forward(self, input_ids, attention_mask):
        x = self.transformer(input_ids=input_ids, attention_mask=attention_mask).last_hidden_state
        x, _ = self.lstm(x)
        x = torch.mean(x, dim=1)
        x = self.dropout(x)
        return self.classifier(x)
