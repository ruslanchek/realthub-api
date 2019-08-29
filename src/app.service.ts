import { Injectable } from '@nestjs/common';
import * as faker from 'faker';

function times(repeatNumber: number, callback: (index: number) => void): void {
  for (let i = 0; i < repeatNumber; i += 1) {
    callback(i);
  }
}

function generate<T = any>(
  amount: number,
  generator: (index: number) => T,
): T[] {
  const generation: T[] = [];

  times(amount, index => {
    generation.push(generator(index));
  });

  return generation;
}

function getById<T = any>(id: string, array: T[]): T | undefined {
  return array.find(item => (item as any).id === id);
}

export const properties = generate<IProperty>(10, propertyIndex => {
  const images = generate<IPropertyImage>(5, imageIndex => {
    return {
      id: faker.random.uuid(),
      src: `https://picsum.photos/id/${propertyIndex + 30}/300/200`,
      title: faker.lorem.sentence(),
      isDefault: imageIndex === 0,
    };
  });

  const params = generate<IPropertyParam>(2, () => {
    return {
      id: faker.random.uuid(),
      value: faker.random.number({ min: 1, max: 4 }).toString(),
      type: faker.lorem.word(),
    };
  });

  return {
    id: propertyIndex.toString(),
    title: faker.lorem.sentence(),
    price: faker.finance.amount(),
    address: faker.address.streetAddress(),
    params,
    images,
  };
});

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
  address: string;
  price: string;
  images: IPropertyImage[];
  params: IPropertyParam[];
}

@Injectable()
export class AppService {
  getProperties(): IProperty[] {
    return properties;
  }

  getProperty(id: string): IProperty | undefined {
    return getById(id, properties);
  }
}
