import RecipeDetail from './RecipeDetail';

interface Props {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: Props) {
  return <RecipeDetail id={params.id} />;
} 