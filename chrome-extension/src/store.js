import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChromeLocalStorage } from "zustand-chrome-storage";
import { useShallow } from "zustand/react/shallow";

// const createSelectors = (store) => {
//   store.use = {};
//   for (const k of Object.keys(store.getState())) {
//     store.use[k] = () => store((s) => s[k]);
//   }

//   return store;
// };
// export const useSelectorStore = createSelectors(useStore);

export const useStore = create(
  persist(
    (set) => ({
      error: "",
      concerns: [],
      isAllDisabled: false,
      concernsAdvicesStorage: [],
      businessTypeStorage: "",
      transcript: "",
      audioEmotion: "",
      domain: "",
      desiredResponse: "",
      emotionallyAwareResponse: "",
      textEmotions: "",
      keywords: "",
      isCapturing: false,
      isClearShown: false,
      setError: (error) => set({ error }),
      setConcerns: (concerns) => set({ concerns }),
      setIsAllDisabled: (isAllDisabled) => set({ isAllDisabled }),
      setConcernsAdvicesStorage: (concernsAdvicesStorage) =>
        set({ concernsAdvicesStorage }),
      setBusinessTypeStorage: (businessTypeStorage) =>
        set({ businessTypeStorage }),
      setTranscript: (transcript) => set({ transcript }),
      setAudioEmotion: (audioEmotion) => set({ audioEmotion }),
      setDomain: (domain) => set({ domain }),
      setDesiredResponse: (desiredResponse) => set({ desiredResponse }),
      setEmotionallyAwareResponse: (emotionallyAwareResponse) =>
        set({ emotionallyAwareResponse }),
      setTextEmotions: (textEmotions) => set({ textEmotions }),
      setKeywords: (keywords) => set({ keywords }),
      setIsCapturing: (isCapturing) => set({ isCapturing }),
      setIsClearShown: (isClearShown) => set({ isClearShown }),
    }),
    {
      name: "local-storage", // Name of the item in chrome.storage.local
      storage: createJSONStorage(() => ChromeLocalStorage),
      partialize: (state) => ({
        concernsAdvicesStorage: state.concernsAdvicesStorage,
        businessTypeStorage: state.businessTypeStorage,
      }),
    }
  )
);

export function useShallowStore(selector) {
  return useStore(useShallow(selector));
}

export const concernsAdvicesStorageSetSelector = ({
  concernsAdvicesStorage,
  setConcernsAdvicesStorage,
}) => ({
  concernsAdvicesStorage,
  setConcernsAdvicesStorage,
});

export const businessTypeStorageSetSelector = ({
  businessTypeStorage,
  setBusinessTypeStorage,
}) => ({
  businessTypeStorage,
  setBusinessTypeStorage,
});

export const isDisabledSetSelector = ({ isAllDisabled, setIsAllDisabled }) => ({
  isAllDisabled,
  setIsAllDisabled,
});

export const concernsSetSelector = ({ concerns, setConcerns }) => ({
  concerns,
  setConcerns,
});

export const errorSetSelector = ({ error, setError }) => ({
  error,
  setError,
});

export const transcriptSetSelector = ({ transcript, setTranscript }) => ({
  transcript,
  setTranscript,
});

export const audioEmotionSetSelector = ({ audioEmotion, setAudioEmotion }) => ({
  audioEmotion,
  setAudioEmotion,
});

export const domainEmotionSetSelector = ({ domain, setDomain }) => ({
  domain,
  setDomain,
});

export const desiredResponseSetSelector = ({
  desiredResponse,
  setDesiredResponse,
}) => ({
  desiredResponse,
  setDesiredResponse,
});

export const emotionalyAwareResponseSetSelector = ({
  emotionallyAwareResponse,
  setEmotionallyAwareResponse,
}) => ({
  emotionallyAwareResponse,
  setEmotionallyAwareResponse,
});

export const textEmotionsSetSelector = ({ textEmotions, setTextEmotions }) => ({
  textEmotions,
  setTextEmotions,
});

export const keywordsSetSelector = ({ keywords, setKeywords }) => ({
  keywords,
  setKeywords,
});

export const isCapturingSetSelector = ({ isCapturing, setIsCapturing }) => ({
  isCapturing,
  setIsCapturing,
});

export const isClearShownSetSelector = ({ isClearShown, setIsClearShown }) => ({
  isClearShown,
  setIsClearShown,
});
