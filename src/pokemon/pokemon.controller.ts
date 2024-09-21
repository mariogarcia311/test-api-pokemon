import { Controller, Get, Param } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller()
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}
  @Get('pokemon')
  async getPokemons() {
    return await this.pokemonService.getPokemons();
  }

  @Get('pokemon/:id')
  async getPokemonById(@Param('id') id: string) {
    return await this.pokemonService.getPokemonById(id);
  }

  @Get('/pokemonAndTypes/:id')
  async getPokemonAndTypesById(@Param('id') id: string) {
    return await this.pokemonService.getPokemonAndTypesById(id);
  }
}
