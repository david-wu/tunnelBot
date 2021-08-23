
export interface ImageClassifiersState  {
  imageClassifiersListVisible: boolean;
  imageClassifiersList: any[];
  selectedImageClassifierId: string;
  imagesByClassifierId: Record<string, any[]>;
  imageClassifierViewTab: string;
  isGeneratingTokenByImageClassifier: Record<string, boolean>;
  imageClassifierTokensByImageClassifier: Record<string, any[]>;
}

export const initialImageClassifiersState = {
  imageClassifiersListVisible: false,
  imageClassifiersList: [],
  selectedImageClassifierId: undefined,
  imagesByClassifierId: {},
  imageClassifierViewTab: undefined,
  isGeneratingTokenByImageClassifier: {},
  imageClassifierTokensByImageClassifier: {},
};
