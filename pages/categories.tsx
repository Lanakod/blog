import {
  Badge,
  Box,
  Button,
  Center,
  ColorInput,
  Group,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";

import { queryClient } from "@/pages/_app";
import { useCreateCategory, useGetCategories } from "@/queries";
import { CreateCategorySchema } from "@/types";
import { CustomNextPage } from "@/types/dts";

const CategoriesPage: CustomNextPage = () => {
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  console.log(categories);
  const router = useRouter();

  // MODAL STATE
  const [createModal, setCreateModal] = useState(false);

  // VALIDATE POST CATEGORY FORM
  const createCategoryForm = useForm({
    validate: zodResolver(CreateCategorySchema),
    initialValues: {
      name: "",
      color: "",
    },
  });

  const { mutate: createCategory, isLoading: createCategoryLoading } =
    useCreateCategory();

  return (
    <>
      <Head>
        <title>Категории</title>
      </Head>
      <main>
        {/*  Title  */}
        <Group align="center" mb="3rem">
          <Title size="1.5rem" weight="500">
            Your categories
          </Title>
          <ThemeIcon variant="light" color="green" size="md">
            <BiCategory size="25" />
          </ThemeIcon>
        </Group>
        {/*  NO categories  */}
        {categories?.length === 0 && !categoriesLoading && (
          <Box>
            <Group align="center">
              <Text size="lg">No Inventory/Index</Text>
              <FiSearch size="20" />
            </Group>
          </Box>
        )}

        {/*  ACCORDION FOR THE DATA  */}

        {categories?.map((ctg) => {
          return (
            <Group mb="1rem" key={ctg.name}>
              <Badge
                sx={{
                  background: `${ctg.color}20`,
                  color: ctg.color,
                }}
              >
                {ctg.name}
              </Badge>
            </Group>
          );
        })}
        <Box>
          <Button
            color="blue"
            variant="outline"
            onClick={() => setCreateModal(true)}
          >
            Новая категория
          </Button>
        </Box>

        {/*  MODALS  */}
        {/*  CREATE CATEGORY  */}
        <Modal
          centered
          opened={createModal}
          onClose={() => setCreateModal(false)}
          title="Create Category"
        >
          <form
            onSubmit={createCategoryForm.onSubmit((values) => {
              createCategory(values, {
                onSuccess: async () => {
                  setCreateModal(false);
                  await queryClient.refetchQueries(["categories"]);
                },
              });
            })}
          >
            <LoadingOverlay
              visible={createCategoryLoading ?? false}
              transitionDuration={500}
            />
            <TextInput
              placeholder="Category name"
              label="Category name"
              withAsterisk
              mb="1rem"
              {...createCategoryForm.getInputProps("name")}
            />
            <ColorInput
              placeholder="Цвет"
              label="Цвет категории"
              withAsterisk
              mb="1rem"
              {...createCategoryForm.getInputProps("color")}
            />
            <Center mb="1rem">
              <Badge
                sx={(theme) => {
                  const { value } = createCategoryForm.getInputProps("color");
                  const color = value
                    ? `${value}20`
                    : `${theme.colors.blue[5]}20`;
                  return {
                    background: color,
                    color: color.substring(0, color.length - 2),
                  };
                }}
              >
                {createCategoryForm.getInputProps("name").value ||
                  "Название категории"}
              </Badge>
            </Center>
            <Group noWrap={false}>
              <Button type="submit">Create</Button>
              <Button color="red" onClick={() => setCreateModal(false)}>
                Exit
              </Button>
            </Group>
          </form>
        </Modal>
      </main>
    </>
  );
};

export default CategoriesPage;
CategoriesPage.requireAuth = ["WRITER"];
