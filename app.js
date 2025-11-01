const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const generatePokemonPromises = () =>
  Array(151)
    .fill()
    .map((_, index) => fetch(getPokemonUrl(index + 1)).then(response => response.json()))

const createPokemonCard = pokemon => {
  const { name, id, types } = pokemon
  const elementTypes = types.map(typeInfo => typeInfo.type.name)
  return `
    <li class="card ${elementTypes[0]}">
      <img class="card-image" alt="${name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png">
      <h2 class="card-title">${id}. ${name}</h2>
      <p class="card-subtitle">${elementTypes.join(" | ")}</p>
    </li>
  `
}

const generateHTML = pokemons => pokemons.map(createPokemonCard).join('')

const insertPokemonsIntoPage = pokemonsHTML => {
  const ul = document.querySelector('[data-js="pokedex"]')
  ul.innerHTML = pokemonsHTML
}

let allPokemons = []

const render = pokemons => insertPokemonsIntoPage(generateHTML(pokemons))

const pokemonPromises = generatePokemonPromises()

Promise.all(pokemonPromises)
  .then(pokemons => {
    allPokemons = pokemons
    render(allPokemons)
  })
  .catch(error => console.error('Erro ao carregar pokémons:', error))

  
const searchInput = document.querySelector('.busca')
if (searchInput) {
  searchInput.addEventListener('input', event => {
    const term = event.target.value.trim().toLowerCase()
    if (!term) {
      render(allPokemons)
      return
    }

    const filtered = allPokemons.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(term)
      const idMatch = String(p.id).startsWith(term)
      return nameMatch || idMatch
    })

    render(filtered)
  })
}





