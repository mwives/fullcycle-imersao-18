import { SpotsService } from '@app/core'
import { Test, TestingModule } from '@nestjs/testing'
import { SpotsController } from './spots.controller'

describe('SpotsController', () => {
  let controller: SpotsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotsController],
      providers: [SpotsService],
    }).compile()

    controller = module.get<SpotsController>(SpotsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
