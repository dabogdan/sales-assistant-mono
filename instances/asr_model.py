# instances/asr_instance.py
import torchaudio

bundle = torchaudio.pipelines.WAV2VEC2_ASR_BASE_960H
asr_model = bundle.get_model()
labels = bundle.get_labels()
