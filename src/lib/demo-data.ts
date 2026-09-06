import type { Macro, Profile } from "./types";
import { uid } from "./utils";

export const SAMPLE_PROFILE: Profile = {
  firstName: "Léa",
  lastName: "Martin",
  email: "lea.martin@email.fr",
  phone: "06 12 34 56 78",
  birthDate: "1994-03-14",
  city: "Paris",
  country: "France",
  occupation: "Graphiste indépendante",
  gender: "Femme",
  language: "Français",
  bio: "J’habite à Paris, je voyage surtout l’été, et je préfère les réponses honnêtes aux cases marketing.",
  likes: "design, randonnée, café, cinéma indépendant",
  dislikes: "démarchage, pubs trop longues, questions pièges",
  holidays: [
    {
      id: uid("hol"),
      name: "Anniversaire",
      month: 3,
      day: 14,
      notes: "Le mien",
    },
    {
      id: uid("hol"),
      name: "Anniversaire de Thomas",
      month: 11,
      day: 2,
      notes: "Conjoint — dîner en famille",
    },
    {
      id: uid("hol"),
      name: "Noël",
      month: 12,
      day: 25,
      notes: "Toujours chez mes parents à Lyon",
    },
    {
      id: uid("hol"),
      name: "Fête nationale",
      month: 7,
      day: 14,
      notes: "Feu d’artifice à Paris",
    },
    {
      id: uid("hol"),
      name: "Départ en vacances d’été",
      month: 7,
      day: 15,
      year: 2026,
      notes: "Deux semaines en Bretagne",
    },
  ],
};

export const SAMPLE_MACROS: Macro[] = [
  {
    id: "macro_sample_cart",
    name: "Ajouter le pull au panier",
    createdAt: Date.now() - 86_400_000,
    steps: [
      {
        id: "s1",
        type: "input",
        targetId: "shop-search",
        value: "laine",
        delay: 400,
        label: "Recherche — laine",
      },
      {
        id: "s2",
        type: "click",
        targetId: "product-pull",
        delay: 600,
        label: "Ouvrir — Pull nordique",
      },
      {
        id: "s3",
        type: "click",
        targetId: "add-pull",
        delay: 500,
        label: "Ajouter au panier",
      },
    ],
  },
];
