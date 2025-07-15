import os
import uuid
import base64
import wave
import subprocess

def write_temp_audio_files(audio_data: bytearray, temp_id: str) -> str:
    temp_webm = f"temp_input_{temp_id}.webm"
    wav_path = f"debug_audio_{temp_id}.wav"

    with open(temp_webm, "wb") as f:
        f.write(audio_data)

    # Convert to proper 16kHz mono WAV using ffmpeg
    os.system(f"ffmpeg -y -i {temp_webm} -ac 1 -ar 16000 -f wav {wav_path}")

    return wav_path


def get_wav_duration(path: str) -> float:
    with wave.open(path, 'rb') as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        return frames / float(rate)
    
def trim_wav(input_path: str, output_path: str, start_sec: float, duration_sec: float):
    subprocess.run([
        "ffmpeg", "-y",
        "-i", input_path,
        "-ss", str(start_sec),
        "-t", str(duration_sec),
        output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def cleanup_temp_audio_files(temp_id: str):
    temp_webm = f"temp_input_{temp_id}.webm"
    wav_path = f"debug_audio_{temp_id}.wav"
    for path in (temp_webm, wav_path):
        if os.path.exists(path):
            os.remove(path)
