import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from './service.controller';
import { ServiceService } from './services/service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ServiceRepository } from './repository/service.repository';
import {
  OrderByKey,
  CreateServiceDto,
  FilterKey,
  FilterServicesDto,
  UpdateServiceDto,
  CreateServiceVersionDto,
} from './dto';

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
describe('ServiceController', () => {
  let controller: ServiceController;
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: ServiceService,
          useValue: {
            createService: jest
              .fn()
              .mockImplementation((service: CreateServiceDto) =>
                Promise.resolve({ id: 'a uuid', ...service }),
              ),
            findAllServices: jest.fn().mockResolvedValue(services),
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
            findOneService: jest.fn().mockResolvedValue({
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
            removeService: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: id,
                service: 'Service 1',
                description: 'this is service 1',
              }),
            ),
            createServiceVersion: jest
              .fn()
              .mockImplementation((version: CreateServiceVersionDto) =>
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
          },
        },
        {
          provide: getRepositoryToken(ServiceRepository),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
    service = module.get<ServiceService>(ServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createService', () => {
    it('should create a service', async () => {
      const createServiceDto: CreateServiceDto = {
        service: 'a new service',
        version: 'version',
        description: 'this is the description',
      };

      await expect(controller.createService(createServiceDto)).resolves.toEqual(
        {
          id: 'a uuid',
          ...createServiceDto,
        },
      );
    });
  });

  describe('findAllServices', () => {
    it('should get an array of services', async () => {
      await expect(controller.findAllServices(0)).resolves.toEqual([
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

  describe('findServiceById', () => {
    it('should get one service', async () => {
      await expect(
        controller.findServiceById('e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6'),
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
        controller.updateService(
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
        controller.removeService('e423f0a8-b9d1-49ff-86c8-b30dd4ffd6a6'),
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
        controller.createServiceVersion(versionDto),
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

  describe('searchServices', () => {
    const filterDto: FilterServicesDto = {
      filterKey: FilterKey.SERVICE,
      filterValue: 'Service 1',
      OrderBy: OrderByKey.CREATEDATE,
      limits: 10,
      offset: 0,
    };
    it('should get an array of services', async () => {
      const searchSpy = jest.spyOn(service, 'filterServices');

      await expect(controller.searchServices(filterDto)).resolves.toEqual([
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
