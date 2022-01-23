import { FilterKey, OrderByKey } from './../dto/filter-searvices.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceRepository } from '../repository/service.repository';
import { ServiceService } from './service.service';
import {
  FilterServicesDto,
  CreateServiceVersionDto,
  CreateServiceDto,
  UpdateServiceDto,
} from '@catalog/service/dto';
import { Version, Service } from '@catalog/service/entities';

const services = [
  {
    service: 'Service 1',
    description: 'this is service 1',
    versions: [],
  },
  {
    service: 'Service 2',
    description: 'this is service 2',
    versions: [],
  },
  {
    service: 'Service 3',
    description: 'this is service 3',
    versions: [],
  },
];

describe('ServiceService', () => {
  let service: ServiceService;
  let repo: ServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: getRepositoryToken(ServiceRepository),
          useValue: {
            createService: jest
              .fn()
              .mockImplementation((userId: string, service: CreateServiceDto) =>
                Promise.resolve({ id: 'a uuid', ...service }),
              ),
            findAllServices: jest.fn().mockResolvedValue(services),
            findServiceByUUID: jest.fn().mockResolvedValue({
              id: 'e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6',
              service: 'Service 1',
              description: 'this is service 1',
              versions: [],
            }),
            updateService: jest
              .fn()
              .mockImplementation((id: string, service: UpdateServiceDto) =>
                Promise.resolve({ id: id, ...service }),
              ),
            removeServiceByUUID: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: id,
                service: 'Service 1',
                description: 'this is service 1',
              }),
            ),
            createServiceVersion: jest
              .fn()
              .mockImplementation(
                (userId: string, version: CreateServiceVersionDto) =>
                  Promise.resolve({
                    id: version.uuid,
                    service: 'Service 1',
                    description: 'this is service 1',
                    versions: [
                      {
                        id: 'a version uuid',
                        version: version.version,
                      },
                    ],
                  }),
              ),
            filterServices: jest
              .fn()
              .mockImplementation((filter: FilterServicesDto) =>
                Promise.resolve([
                  {
                    service: 'Service 1',
                    description: 'this is service 1',
                    versions: [],
                  },
                ]),
              ),
          },
        },
      ],
    }).compile();

    service = module.get<ServiceService>(ServiceService);
    repo = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
        service: 'a new service',
        version: 'version',
        description: 'this is the description',
      };

      await expect(
        service.createService('userId', createServiceDto),
      ).resolves.toEqual({
        id: 'a uuid',
        ...createServiceDto,
      });
    });
  });
  describe('findAllServices', () => {
    it('should get an array of services', async () => {
      await expect(service.findAllServices(0)).resolves.toEqual([
        {
          service: 'Service 1',
          description: 'this is service 1',
          versions: [],
        },
        {
          service: 'Service 2',
          description: 'this is service 2',
          versions: [],
        },
        {
          service: 'Service 3',
          description: 'this is service 3',
          versions: [],
        },
      ]);
    });
  });
  describe('findOneService', () => {
    it('should get one service', async () => {
      await expect(
        service.findOneService('e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6'),
      ).resolves.toEqual({
        id: 'e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6',
        service: 'Service 1',
        description: 'this is service 1',
        versions: [],
      });
    });
  });
  describe('updateService', () => {
    it('should update a service', async () => {
      const updateServiceDto: UpdateServiceDto = {
        service: 'a new service',
        description: 'this is the description',
      };

      await expect(
        service.updateService(
          'e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6',
          updateServiceDto,
        ),
      ).resolves.toEqual({
        id: 'e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6',
        service: 'a new service',
        description: 'this is the description',
      });
    });
  });
  describe('removeService', () => {
    it('should return the deleted service', async () => {
      await expect(
        service.removeService('e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6'),
      ).resolves.toEqual({
        id: 'e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6',
        service: 'Service 1',
        description: 'this is service 1',
      });
    });
  });
  describe('createServiceVersion', () => {
    it('should create a new service version', async () => {
      const versionDto: CreateServiceVersionDto = {
        uuid: 'service uuid',
        version: 'v0.0.2',
      };

      await expect(
        service.createServiceVersion('userId', versionDto),
      ).resolves.toEqual({
        id: 'service uuid',
        service: 'Service 1',
        description: 'this is service 1',
        versions: [
          {
            id: 'a version uuid',
            version: 'v0.0.2',
          },
        ],
      });
    });
  });

  describe('filterServices', () => {
    const filterDto: FilterServicesDto = {
      filterKey: FilterKey.SERVICE,
      filterValue: 'Service 1',
      OrderBy: OrderByKey.CREATEDATE,
      limits: 10,
      offset: 0,
    };
    it('should get an array of services', async () => {
      const searchSpy = jest.spyOn(service, 'filterServices');

      await expect(service.filterServices(filterDto)).resolves.toEqual([
        {
          service: 'Service 1',
          description: 'this is service 1',
          versions: [],
        },
      ]);

      expect(searchSpy).toHaveBeenCalledWith(filterDto);
    });
  });
});
