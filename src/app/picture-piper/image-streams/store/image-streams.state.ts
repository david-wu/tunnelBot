
export interface ImageStreamsState  {
  imageStreamsListVisible: boolean;
  imageStreamsList: any[];
  selectedImageStreamId: string;
  imagesByStreamId: Record<string, any[]>;
  imageStreamViewTab: string;
  isGeneratingTokenByImageStream: Record<string, boolean>;
  imageStreamTokensByImageStream: Record<string, any[]>;
}

export const initialImageStreamsState = {
  imageStreamsListVisible: false,
  imageStreamsList: [],
  selectedImageStreamId: undefined,
  imagesByStreamId: {},
  imageStreamViewTab: undefined,
  isGeneratingTokenByImageStream: {},
  imageStreamTokensByImageStream: {},
};
