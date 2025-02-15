import { createContext, useContext, useState } from "react";

export type CodeContextValues = {
  startedTyping: boolean;
  characters: Array<boolean | 'space'>;
  score: number;
  accuracy: number;

  setStartedTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacters: React.Dispatch<React.SetStateAction<Array<boolean | 'space'>>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setAccuracy: React.Dispatch<React.SetStateAction<number>>;
}

const CodeContext = createContext<CodeContextValues>({
  startedTyping: false,
  characters: [],
  score: 0,
  accuracy: 0,

  setStartedTyping: () => { },
  setCharacters: () => { },
  setScore: () => { },
  setAccuracy: () => { },
});

export function useCodeContext() {
  return useContext(CodeContext);
}

type CodeContextProviderProps = {
 children: React.ReactNode,
}

function CodeContextProvider({ children }: CodeContextProviderProps) {
  const [startedTyping, setStartedTyping] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Array<boolean | 'space'>>([]);
  const [score, setScore] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  return (
    <CodeContext.Provider value={{
      startedTyping,
      characters,
      score,
      accuracy,

      setStartedTyping,
      setCharacters,
      setScore,
      setAccuracy,
    }}>
      {children}
    </CodeContext.Provider>
  )
}

export default CodeContextProvider;
