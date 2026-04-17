import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LogOut,
  Pencil,
  PlusCircle,
  SaveIcon,
  Search,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogout } from "@/hooks/pages/useLogout";
import { useProducts } from "@/hooks/pages/useProducts";
import Loader from "@/components/Loader";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as editorType } from "tinymce";
import { useRef } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

export function Products() {
  const { handleLogout, logoutLoading } = useLogout();
  const {
    products,
    loading,
    form,
    onSubmit,
    prodSaveLoading,
    prodDialogOpen,
    setProdDialogOpen,
    handleDelete,
  } = useProducts();

  //const id = useParams().id;

  const editorRef = useRef<editorType | null>(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>

        <Button variant={"destructive"} onClick={handleLogout}>
          {logoutLoading ? (
            <Loader />
          ) : (
            <>{<LogOut className="w-4 h-4" />} Terminar Sessão</>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <form className="flex items-center gap-2">
          <Input name="id" placeholder="Id do Produto" />
          <Input name="name" placeholder="Nome do Produto" />
          <Button type="submit" variant="outline">
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </form>

        <Dialog open={prodDialogOpen} onOpenChange={setProdDialogOpen}>
          <DialogTrigger asChild>
            <Button type="submit">
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Adicionando novo Produto no Sistema.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((event) => onSubmit(event))}
                className="w-full space-y-2 flex flex-col items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black">Nome</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Digite o Nome do Produto."
                          className={`${
                            form.formState.errors.name
                              ? "border-red-500 border-[1.5px]"
                              : "border-gray-200"
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-black">Preço</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Digite o Preço do Produto."
                          className={`${
                            form.formState.errors.price
                              ? "border-red-500 border-[1.5px]"
                              : "border-gray-200"
                          }`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={prodSaveLoading}>
                    {prodSaveLoading ? (
                      <Loader />
                    ) : (
                      <> {<SaveIcon className="w-4 h-4" />} Gravar Produto</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg p-2">
        <Editor
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          init={{
            height: 200,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "FontSize | bold italic forecolor | alignleft aligncenter " +
              " alignright alignjustify | LineHeight bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:12pt }",

            // Prevent HTML entity encoding
            entity_encoding: "raw",

            // Ensure UTF-8 characters are preserved
            encoding: "xml",
            entities: "160,nbsp",

            // Preserve Tailwind classes and styles
            valid_elements: "*[*]",
            extended_valid_elements: "*[*]",
            valid_children: "+body[style],+body[script]",
            convert_urls: false,

            // Keep inline styles and classes
            verify_html: false,
          }}
        />

        <Button onClick={log} className="mt-2 mb-7 w-full">
          Click to Console Log the TinyMCE Editor content
        </Button>

        <Table className="min-h-24">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Acção</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow className="flex absolute items-center content-center w-full h-12">
                <TableCell className="flex content-center w-full">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : (
              products.map((value: Product) => (
                <TableRow key={value.id}>
                  <TableCell className="font-medium">{value.id}</TableCell>
                  <TableCell>{value.name}</TableCell>
                  <TableCell className="text-right">R$ {value.price}</TableCell>
                  <TableCell className="text-right space-x-3">
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant={"outline"} className="px-3">
                            <Pencil className="w-4 h-4 text-green-700" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Produto</DialogTitle>
                            <DialogDescription>
                              Editando Produto {value.name} <br />
                              Preço actual: R$ {value.price}
                            </DialogDescription>
                          </DialogHeader>

                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit((event) =>
                                onSubmit(event, value.id),
                              )}
                              className="w-full space-y-2 flex flex-col items-center gap-2"
                            >
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel className="text-black">
                                      Nome
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        placeholder="Digite o novo Nome do Produto."
                                        className={`${
                                          form.formState.errors.name
                                            ? "border-red-500 border-[1.5px]"
                                            : "border-gray-200"
                                        }`}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                  <FormItem className="w-full">
                                    <FormLabel className="text-black">
                                      Preço
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="Digite o novo Preço do Produto."
                                        className={`${
                                          form.formState.errors.price
                                            ? "border-red-500 border-[1.5px]"
                                            : "border-gray-200"
                                        }`}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-xs" />
                                  </FormItem>
                                )}
                              />

                              <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">
                                    Cancelar
                                  </Button>
                                </DialogClose>
                                <Button
                                  type="submit"
                                  disabled={prodSaveLoading}
                                >
                                  {prodSaveLoading ? (
                                    <Loader />
                                  ) : (
                                    <>
                                      {<SaveIcon className="w-4 h-4" />} Gravar
                                      Produto
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </>

                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant={"outline"} className="px-3">
                            <Trash2 className="w-4 h-4 text-red-700" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Eliminando Produto</DialogTitle>
                            <DialogDescription>
                              Tem certeza que deseja eliminar este Produto?
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter className="gap-1">
                            <DialogClose asChild>
                              <Button type="button" variant="outline">
                                Cancelar
                              </Button>
                            </DialogClose>
                            <Button onClick={() => handleDelete(value.id)}>
                              <Trash2 className="w-4 h-4" />
                              Confirmar
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
