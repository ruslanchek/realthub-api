import { Injectable } from '@nestjs/common';
import * as faker from 'faker';
import {
  IProperty,
  IPropertyImage,
  IPropertyParam,
} from './property.interfaces';
import { IApiResponse } from 'src/interfaces/common';

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

const properties = generate<IProperty>(40, propertyIndex => {
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
    price: parseFloat(faker.finance.amount()),
    address: faker.address.streetAddress(),
    address2: faker.address.secondaryAddress(),
    city: faker.address.city(),
    zip: faker.address.zipCode(),
    state: faker.address.state(),
    country: faker.address.country(),
    images,
    params,
    sale: faker.random.boolean()
      ? parseFloat(faker.finance.amount())
      : undefined,
    geo: {
      lat: parseFloat(faker.address.latitude()),
      lng: parseFloat(faker.address.longitude()),
    },
  };
});

@Injectable()
export class PropertyService {
  getProperties(): IApiResponse<IProperty[]> {
    return {
      data: properties,
    };
  }

  getProperty(id: string): IApiResponse<IProperty> {
    return {
      data: getById(id, properties),
    };
  }
}
