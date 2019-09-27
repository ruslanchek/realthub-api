export interface IPropertyImage {
  id: string;
  src: string;
  title: string;
  isDefault?: boolean;
}

export interface IPropertyParam {
  id: string;
  value: string;
  type: string;
}

export interface IProperty {
  id: string;
  title: string;
  price: number;
  images: IPropertyImage[];
  params: IPropertyParam[];
  address: string;
  address2: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  sale: number | undefined;
  geo: {
    lat: number;
    lng: number;
  };
}
