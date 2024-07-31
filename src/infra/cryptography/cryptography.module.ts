import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/gym/application/cryptography/encrypter'
import { HashComparer } from '@/domain/gym/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/gym/application/cryptography/hash-generator'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
