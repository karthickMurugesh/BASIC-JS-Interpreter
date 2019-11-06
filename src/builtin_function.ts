import { RTResult } from "./RTResult";
import { BaseFunction } from "./base_function";
import { Context } from "./context";
import { BNumber } from "./number";
import { RTError } from "./error/RT_error";
import { List } from "./list";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Interpreter } from "./interpreter";

export class BuiltInFunction extends BaseFunction {
   arg_names: string[] | undefined;
   static print: BuiltInFunction;
   static print_ret: BuiltInFunction;
   static input: BuiltInFunction;
   static input_int: BuiltInFunction;
   static clear: BuiltInFunction;
   static is_number: BuiltInFunction;
   static is_string: BuiltInFunction;
   static is_list: BuiltInFunction;
   static is_function: BuiltInFunction;
   static append: BuiltInFunction;
   static pop: BuiltInFunction;
   static extend: BuiltInFunction;
   static len: BuiltInFunction;
   static run: BuiltInFunction;
   constructor(name: string) {
      super(name);   
   }

   execute(args: any[]) {
      var res = new RTResult();
      var exec_ctx = this.generate_new_context();
      var method_name = `execute_${this.name}`;
      var method:any = undefined;
      switch(method_name)
      {
         case "no_visit_method":
         method = this.no_visit_method;
         break;
         case "execute_print":
         method = this.execute_print;
         break;
         case "execute_input_int":
         method = this.execute_input_int;
         break;
         case "execute_print_ret":
         method = this.execute_print_ret;
         break;
         case "execute_input":
         method = this.execute_input;
         break;
         case "execute_input_int":
         method = this.execute_input_int;
         break;
         case "execute_clear":
         method = this.execute_clear;
         break;
         case "execute_is_number":
         method = this.execute_is_number;
         break;
         case "execute_is_string":
         method = this.execute_is_string;
         break;
         case "execute_is_list":
         method = this.execute_is_list;
         break;
         case "execute_is_function":
         method = this.execute_is_function;
         break;
         case "execute_append":
         method = this.execute_append;
         break;
         case "execute_pop":
         method = this.execute_pop;
         break;
         case "execute_extend":
         method = this.execute_extend;
         break;
         case "execute_len":
         method = this.execute_len;
         break;
         case "execute_run":
         method = this.execute_run;
         break;
      } 
      res.register(this.check_and_populate_args(method.arg_names, args, exec_ctx))
      if (res.should_return()) return res
      var return_value = res.register(method(exec_ctx));
      if (res.should_return()) return res
      return res.success(return_value)
   }

   no_visit_method(node: any, context: Context) {
      throw new Error(`No execute_${this.name} method ined`)
   }

   copy() {
      var copy = new BuiltInFunction(this.name)
      copy.set_context(this.context)
      copy.set_pos(this.pos_start, this.pos_end)
      return copy
   }

   toString() {
      return `<built-in function ${this.name}>`;
   }

   execute_print(exec_ctx: Context) {
      throw new RTError(undefined, undefined, "operation not supported", exec_ctx);
   }


   execute_print_ret(exec_ctx: Context) {
      throw new RTError(undefined, undefined, "operation not supported", exec_ctx);
   }


   execute_input(exec_ctx: Context) {
      throw new RTError(undefined, undefined, "operation not supported", exec_ctx);

   }


   execute_input_int(exec_ctx: Context) {
      throw new RTError(undefined, undefined, "operation not supported", exec_ctx);
   }


   execute_clear(exec_ctx: Context) {
      throw new RTError(undefined, undefined, "operation not supported", exec_ctx);
   }


   execute_is_number(exec_ctx: Context) {
      var is_number = exec_ctx.symbol_table.value instanceof Number;
      return new RTResult().success(is_number);
   }

   execute_is_string(exec_ctx: Context) {
      var is_number = exec_ctx.symbol_table.value instanceof String
      return new RTResult().success(is_number);
   }
   execute_is_list(exec_ctx: Context) {
      var is_number = exec_ctx.symbol_table.value instanceof List
      return new RTResult().success(is_number);
   }

   execute_is_function(exec_ctx: Context) {
      var is_number = exec_ctx.symbol_table.value instanceof BaseFunction
      return new RTResult().success(is_number);
   }

   execute_append(exec_ctx: Context) {
      var list_ = exec_ctx.symbol_table.list;
      var value = exec_ctx.symbol_table.value
      if (!(list_ instanceof List)) {

         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "First argument must be list",
            exec_ctx
         ))
      }
      list_.elements.push(value)
      return new RTResult().success(BNumber.null)
   }

   execute_pop(exec_ctx: Context) {
      var list_ = exec_ctx.symbol_table.list;
      var index = exec_ctx.symbol_table.index;

      if (!(list_ instanceof List)) {

         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "First argument must be list",
            exec_ctx
         ))
      }

      if (!(index instanceof BNumber)) {

         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "Second argument must be number",
            exec_ctx
         ))
      }

      try {
         var element = list_.elements.pop(index.value)

      } catch (e) {

         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            'Element at this index could not be removed from list because index is out of bounds',
            exec_ctx
         ))
      }

      return new RTResult().success(element)
   }

   execute_extend(exec_ctx: Context) {

      var listA = exec_ctx.symbol_table.get("listA")
      var listB = exec_ctx.symbol_table.get("listB")

      if (!(listA instanceof List)) {

         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "First argument must be list",
            exec_ctx
         ))
      }

      if (!(listB instanceof List)) {
         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "Second argument must be list",
            exec_ctx
         ))
      }
      listA.elements.extend(listB.elements)
      return new RTResult().success(BNumber.null)
   }

   execute_len(exec_ctx: Context) {

      var list_ = exec_ctx.symbol_table.list
      if (!(list_ instanceof List))
         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "Argument must be list",
            exec_ctx
         ))

      return new RTResult().success(new BNumber(list_.elements.length))
   }

   execute_run(exec_ctx: Context) {

      var _fn = exec_ctx.symbol_table.fn;
      if (!(_fn instanceof String)) {
         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            "Second argument must be string",
            exec_ctx
         ))
      }

      var fn = exec_ctx.symbol_table.fn;
      try {

         var script = fn;
         var res = this.run(fn, script);
         return new RTResult().success(BNumber.null)

      } catch (e) {
         return new RTResult().failure(new RTError(
            this.pos_start, this.pos_end,
            `Failed to load script \"${fn}\"\n` + e.toString(),
            exec_ctx
         ))
      }

   }
   run(fn: any, script: any) {
      throw new Error("Method not implemented.");
   }
}




BuiltInFunction.print       =   new BuiltInFunction("print")
BuiltInFunction.print_ret   =   new BuiltInFunction("print_ret")
BuiltInFunction.input       =   new BuiltInFunction("input")
BuiltInFunction.input_int   =   new  BuiltInFunction("input_int")
BuiltInFunction.clear       =   new BuiltInFunction("clear")
BuiltInFunction.is_number   =   new BuiltInFunction("is_number")
BuiltInFunction.is_string   =   new  BuiltInFunction("is_string")
BuiltInFunction.is_list     =   new  BuiltInFunction("is_list")
BuiltInFunction.is_function =   new  BuiltInFunction("is_function")
BuiltInFunction.append      =   new BuiltInFunction("append")
BuiltInFunction.pop         =   new BuiltInFunction("pop")
BuiltInFunction.extend      =   new  BuiltInFunction("extend")
BuiltInFunction.len			 =   new  BuiltInFunction("len")  
BuiltInFunction.run			= new BuiltInFunction("run")

