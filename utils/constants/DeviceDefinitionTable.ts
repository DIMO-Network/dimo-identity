import { DeviceDefinitionInput } from '../types';

export const mockDdId1 = '111AAA111aaa111AAA111aaa111';
export const mockDdId2 = '222BBB222bbb222BBB222bbb222';
export const mockDdId3 = '333CCC333ccc333CCC333ccc333';

export const mockDdModel1 = 'mockDdModel1';
export const mockDdModel2 = 'mockDdModel2';
export const mockDdModel3 = 'mockDdModel3';

export const mockDdYear1 = 2021;
export const mockDdYear2 = 2022;
export const mockDdYear3 = 2023;

export const mockDdInput1 = {
    id: mockDdId1,
    model: mockDdModel1,
    year: mockDdYear1,
    // TODO mock metadata
    metadata: ''
}

export const mockDdInputBatch: DeviceDefinitionInput[] = [
    {
        id: mockDdId1,
        model: mockDdModel1,
        year: mockDdYear1,
        // TODO mock metadata
        metadata: ''
    },
    {
        id: mockDdId2,
        model: mockDdModel2,
        year: mockDdYear2,
        // TODO mock metadata
        metadata: ''
    },
    {
        id: mockDdId3,
        model: mockDdModel3,
        year: mockDdYear3,
        // TODO mock metadata
        metadata: ''
    }
]