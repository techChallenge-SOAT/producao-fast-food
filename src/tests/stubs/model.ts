import type { Document } from 'mongoose';

type Modelable = Document & {
  status: string;
  toValueObject(): Document;
};

let collection: Modelable[] = []; //in memory collection

class ModelStub {
  document?: Modelable;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private data: any) {
    const index = collection.findIndex((doc) => doc.id === data.id);
    const id = index !== -1 ? data.id : String(collection.length + 1);
    this.document = {
      ...data,
      id,
      toValueObject: () => data,
    };
    return this;
  }
  set status(status: string) {
    if (!this.document) {
      throw Error('Document not found');
    }
    this.document.status = status;
  }
  save() {
    if (!this.document) {
      throw Error('Document not found');
    }
    const index = collection.findIndex((doc) => doc.id === this.document?.id);
    if (index !== -1) {
      const newCollection = [...collection];
      newCollection[index] = this.document;
      collection = newCollection;
      return this;
    }
    collection.push(this.document);
    delete this.document;
    return this;
  }
  static find() {
    return {
      sort() {
        return {
          limit() {
            return {
              async exec() {
                return collection;
              },
            };
          },
        };
      },
    };
  }
  static async findById(id: string) {
    const found = collection.find((doc) => doc.id === id);
    if (!found) {
      throw Error('Document not found');
    }
    return new ModelStub(found);
  }

  async deleteOne() {
    if (!this.document) {
      throw Error('Document not found');
    }
    const index = collection.findIndex((doc) => doc.id === this.document?.id);
    collection.splice(index, 1);
    return true;
  }

  toValueObject() {
    return this.document;
  }
  static clear() {
    collection.splice(0, collection.length);
  }

  static __inspectCollection__() {
    console.log('INSPECTING COLLECTION');
    console.log(collection);
    return collection;
  }
}

export default ModelStub;
