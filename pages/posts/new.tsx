import {
  Autocomplete,
  Button,
  Group,
  Input,
  LoadingOverlay,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { Highlight } from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Head from "next/head";
import React from "react";
import { BiCategory } from "react-icons/bi";

import { queryClient } from "@/pages/_app";
import { useCreatePost, useGetCategories } from "@/queries";
import { CreatePostSchema } from "@/types";
import { CustomNextPage } from "@/types/dts";

const NewPostPage: CustomNextPage = () => {
  const { data: categories, isLoading } = useGetCategories();
  const createPostForm = useForm({
    validate: zodResolver(CreatePostSchema),
    initialValues: {
      title: "",
      content: "",
      slug: "",
      categoryId: "",
    },
  });
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    onUpdate: (props) => {
      createPostForm.setValues({ content: props.editor.getHTML() });
    },
    content: createPostForm.getInputProps("content").value,
  });
  const { mutate: createPost, isLoading: createPostLoading } = useCreatePost();

  return (
    <>
      <Head>
        <title>Новый пост</title>
      </Head>
      <main>
        <Group align="center" mb="3rem">
          <Title size="1.5rem" weight="500">
            Новый пост
          </Title>
          <ThemeIcon variant="light" color="green" size="md">
            <BiCategory size="25" />
          </ThemeIcon>
        </Group>
        <form
          onSubmit={createPostForm.onSubmit(
            (values) => {
              const ctg = categories?.find((c) => {
                return c.name === values.categoryId;
              });
              console.log(ctg);
              if (categories && ctg) {
                values.categoryId = ctg.id;
                createPost(values, {
                  onSuccess: async () => {
                    await queryClient.refetchQueries(["posts"]);
                  },
                  onError: async (e) => {
                    console.log(e);
                  },
                });
              }
            },
            (errors, values) => {
              console.log(errors, values);
            }
          )}
        >
          <LoadingOverlay
            visible={createPostLoading ?? false}
            transitionDuration={500}
          />
          <TextInput
            placeholder="Заголовок"
            label="Заголовок"
            withAsterisk
            mb="1rem"
            {...createPostForm.getInputProps("title")}
          />
          <Autocomplete
            placeholder="Категория"
            label="Категория"
            withAsterisk
            mb="1rem"
            nothingFound="Категория не найдена"
            transitionProps={{
              transition: "pop-top-left",
              duration: 80,
              timingFunction: "ease",
            }}
            data={
              categories?.map((c) => ({
                value: c.name,
                id: c.id,
              })) || []
            }
            {...createPostForm.getInputProps("categoryId")}
          />

          <Input.Wrapper {...createPostForm.getInputProps("content")}>
            <RichTextEditor editor={editor}>
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          </Input.Wrapper>

          <Group noWrap={false} mt="1rem">
            <Button color="red">Назад</Button>
            <Button type="submit">Создать</Button>
          </Group>
        </form>
      </main>
    </>
  );
};

export default NewPostPage;
NewPostPage.requireAuth = ["WRITER"];
