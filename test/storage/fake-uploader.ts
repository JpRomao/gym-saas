import { randomUUID } from 'crypto'

import {
  Uploader,
  UploadParams,
} from '@/domain/gym/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
