import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class PokemonService {
  private readonly apiUrl = 'https://pokeapi.co/api/v2';
  constructor(private readonly httpService: HttpService) {}

  async getPokemons() {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.apiUrl}/pokemon/?limit=100&offset=0`)
          .pipe(map(({ data }) => ({ results: data.results }))),
      );
      return response;
    } catch (error) {
      throw new Error(`Error fetching: ${error.message}`);
    }
  }

  async getPokemonById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.apiUrl}/pokemon/${id}`)
          .pipe(map(({ data }) => ({ name: data.name, types: data.types }))),
      );

      return response;
    } catch (error) {
      throw new BadRequestException('Error find pokemon');
    }
  }

  async getPokemonAndTypesById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(`${this.apiUrl}/pokemon/${id}`)
          .pipe(map(({ data }) => ({ name: data.name, types: data.types }))),
      );

      response.types = await this.getTypesDetails(response.types);

      return response;
    } catch (error) {
      throw new BadRequestException('Error find pokemon');
    }
  }

  async getTypesDetails(types: any[]): Promise<any[]> {
    try {
      const typeRequests = types.map(async (_type) =>
        firstValueFrom(
          this.httpService
            .get(_type.type.url)
            .pipe(
              map(({ data }) =>
                data.names.filter((_name) =>
                  ['es', 'ja'].includes(_name.language.name),
                ),
              ),
            ),
        ),
      );

      return await Promise.all(typeRequests);
    } catch (error) {
      throw new BadRequestException('Error processing Pokémon types');
    }
  }
}
