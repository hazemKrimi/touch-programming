import { createContext, useContext, useEffect, useState } from "react";

export type TypingContextValues = {
  startedTyping: boolean;
  characters: Array<boolean | 'space'>;
  timer: number;
  score: number;
  accuracy: number;

  setStartedTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacters: React.Dispatch<React.SetStateAction<Array<boolean | 'space'>>>;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setAccuracy: React.Dispatch<React.SetStateAction<number>>;
}

const TypingContext = createContext<TypingContextValues>({
  startedTyping: false,
  characters: [],
  timer: 0,
  score: 0,
  accuracy: 0,

  setStartedTyping: () => { },
  setCharacters: () => { },
  setTimer: () => { },
  setScore: () => { },
  setAccuracy: () => { },
});

export function useTypingContext() {
  return useContext(TypingContext);
}

type TypingContextProviderProps = {
 children: React.ReactNode,
}

function TypingContextProvider({ children }: TypingContextProviderProps) {
  const [startedTyping, setStartedTyping] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Array<boolean | 'space'>>([]);
  const [timer, setTimer] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    let interval = null;

    if (!startedTyping) {
      if (interval) clearInterval(interval);

      return;
    }

    interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startedTyping]);

  return (
    <TypingContext.Provider value={{
      startedTyping,
      characters,
      timer,
      score,
      accuracy,

      setStartedTyping,
      setCharacters,
      setTimer,
      setScore,
      setAccuracy,
    }}>
      {children}
    </TypingContext.Provider>
  )
}

export default TypingContextProvider;
