import { DeviceDefinitionInput } from '../types';

export const mockId1 = 'mockDdModel1_2021';
export const mockId2 = 'mockDdModel2_2022';
export const mockId3 = 'mockDdModel3_2023';

export const mockDdModel1 = 'mockDdModel1';
export const mockDdModel2 = 'mockDdModel2';
export const mockDdModel3 = 'mockDdModel3';

export const mockDdYear1 = 2021;
export const mockDdYear2 = 2022;
export const mockDdYear3 = 2023;

export const mockKsuid1 = '111AAA111aaa111AAA111aaa111';
export const mockKsuid2 = '222BBB222bbb222BBB222bbb222';
export const mockKsuid3 = '333CCC333ccc333CCC333ccc333';

export const mockDdMetadata1 = {
    mpg: '20',
    mpg_city: '17',
    base_msrp: '67795',
    fuel_type: 'Gasoline',
    wheelbase: '109 WB',
    generation: '1',
    mpg_highway: '25',
    vehicle_type: 'PASSENGER CAR',
    driven_wheels: 'RWD',
    number_of_doors: '2',
    powertrain_type: 'ICE',
    manufacturer_code: '6AE47',
    fuel_tank_capacity_gal: '16'
};
export const mockDdMetadata2 = {
    mpg: '22',
    mpg_city: '19',
    base_msrp: '58050',
    fuel_type: 'GASOLINE',
    wheelbase: '111 WB',
    generation: '3',
    mpg_highway: '26',
    vehicle_type: 'PASSENGER CAR',
    driven_wheels: 'AWD',
    number_of_doors: '4',
    powertrain_type: 'ICE',
    manufacturer_code: 'YD4H8KKNW',
    fuel_tank_capacity_gal: '19.5'
}
export const mockDdMetadata3 = {
    mpg: '27.000000',
    mpg_city: '22.000000',
    base_msrp: '42750',
    fuel_type: 'Gasoline',
    wheelbase: '111 WB',
    generation: '1',
    mpg_highway: '32.000000',
    vehicle_type: 'PASSENGER CAR',
    driven_wheels: 'AWD',
    number_of_doors: '2',
    powertrain_type: 'ICE',
    manufacturer_code: '154D',
    fuel_tank_capacity_gal: '15.800000'
}

export const mockDdInput1: DeviceDefinitionInput = {
    id: mockId1,
    model: mockDdModel1,
    year: mockDdYear1,
    metadata: JSON.stringify(mockDdMetadata1),
    ksuid: mockKsuid1
}
export const mockDdInput2: DeviceDefinitionInput = {
    id: mockId2,
    model: mockDdModel2,
    year: mockDdYear2,
    metadata: JSON.stringify(mockDdMetadata2),
    ksuid: mockKsuid2
}
export const mockDdInput3: DeviceDefinitionInput = {
    id: mockId3,
    model: mockDdModel3,
    year: mockDdYear3,
    metadata: JSON.stringify(mockDdMetadata3),
    ksuid: mockKsuid3
}

export const mockDdInputBatch: DeviceDefinitionInput[] = [
    mockDdInput1,
    mockDdInput2,
    mockDdInput3
]
export const mockDdInvalidInputBatch: DeviceDefinitionInput[] = [
    mockDdInput1,
    mockDdInput1
]