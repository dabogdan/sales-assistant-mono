# services/model_services/asr_service.py
import torch
import torchaudio
from instances.asr_model import asr_model, labels

def transcribe_audio(wav_path: str) -> str:
    try:
        waveform, sample_rate = torchaudio.load(wav_path)

        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)

        emissions, _ = asr_model(waveform)
        predicted_ids = torch.argmax(emissions, dim=-1)

        # CTC decoding: collapse repeats and remove blanks (assume blank = 0)
        transcript = []
        prev_id = -1
        for idx in predicted_ids[0]:
            idx = idx.item()
            if idx != prev_id and idx != 0:  # 0 — blank token
                transcript.append(labels[idx])
            prev_id = idx

        # Replace '|' with space and join letters
        text = "".join(transcript).replace("|", " ")
        return text.strip().capitalize()
    except Exception as e:
        print("❌ ASR (speech recognition) failed:", e)
        raise