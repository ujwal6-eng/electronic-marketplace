declare module 'react-map-gl' {
  import * as React from 'react';

  export interface ViewState {
    longitude: number;
    latitude: number;
    zoom: number;
  }

  export interface MapProps extends ViewState {
    mapboxAccessToken: string;
    style?: React.CSSProperties;
    mapStyle?: string;
    onMove?: (evt: { viewState: ViewState }) => void;
    children?: React.ReactNode;
  }

  const Map: React.ComponentType<MapProps>;

  export interface MarkerProps {
    longitude: number;
    latitude: number;
    anchor?: string;
    onClick?: (event: any) => void;
    children?: React.ReactNode;
  }

  export const Marker: React.ComponentType<MarkerProps>;

  export interface PopupProps {
    longitude: number;
    latitude: number;
    anchor?: string;
    onClose?: () => void;
    closeButton?: boolean;
    closeOnClick?: boolean;
    children?: React.ReactNode;
  }

  export const Popup: React.ComponentType<PopupProps>;

  export default Map;
}
