
export interface ImageSourcesState  {
  imageSourcesListVisible: boolean;
  imageSourcesList: any[];
  selectedImageSourceId: string;
  imagesBySourceId: Record<string, any[]>;
  imageSourceViewTab: string;
  isGeneratingTokenByImageSource: Record<string, boolean>;
  imageSourceTokensByImageSource: Record<string, any[]>;
}

export const initialImageSourcesState = {
  imageSourcesListVisible: false,
  imageSourcesList: [],
  selectedImageSourceId: undefined,
  imagesBySourceId: {},
  imageSourceViewTab: undefined,
  isGeneratingTokenByImageSource: {},
  imageSourceTokensByImageSource: {},
};
