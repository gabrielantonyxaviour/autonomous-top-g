import math
import torch
import numpy as np
import torch.nn as nn
import torch.nn.functional as F

from ezkl import export
import ezkl_lib
import os
import json 

"""
Transformer model
"""
class TransformerModel(nn.Module):
    """
    Input: sinp - iteger representing the input size of the model
           ntoken - integer representing the amount of total tokens
           ninp - integer representing number of input layers
           nhead - integer representing the number of heads in the multiheadattention models
           nhid - integer representing the dimension of the feedforward network model in nn.TransformerEncoder
           nlayers - integer representing the number of nn.TransformerEncoderLayer in nn.TransformerEncoder
           dropout - integer representing the dropout percentage you want to use (Default=0.5) [OPTIONAL]
           padding_indx - integer representing the index of the padding token (Default=32) [OPTIONAL]
    Description: Initailize transormer model class creating the appropiate layers
    Output: None
    """
    def __init__(self, sinp, ntoken, ninp, nhead, nhid, nlayers, dropout=0.5, padding_idx=32):
        super(TransformerModel, self).__init__()
        from torch.nn import TransformerEncoder, TransformerEncoderLayer
        self.model_type = 'Transformer'
        self.pos_encoder = PositionalEncoding(ninp, dropout) #Positional encoding layer
        encoder_layers = TransformerEncoderLayer(ninp, nhead, nhid, dropout) #Encoder layers
        self.transformer_encoder = TransformerEncoder(encoder_layers, nlayers) #Wrap all encoder nodes (multihead)
        self.encoder = nn.Embedding(ntoken, ninp, padding_idx=padding_idx) #Initial encoding of imputs embed layers
        self.padding_idx = padding_idx #Index of padding token
        self.ninp = ninp #Number of input items
        self.softmax = nn.Softmax(dim=1) #Softmax activation layer
        self.gelu = nn.GELU() #GELU activation layer
        self.flatten = nn.Flatten(start_dim=1) #Flatten layer
        self.decoder = nn.Linear(ninp,1) #Decode layer
        self.v_output = nn.Linear(sinp,3) #Decode layer
        self.p_output = nn.Linear(sinp,4096) #Decode layer
        self.init_weights()

    """
    Input: None
    Description: set the intial weights
    Output: None
    """
    def init_weights(self):
        initrange = 0.1
        self.encoder.weight.data.uniform_(-initrange, initrange)
        self.decoder.bias.data.zero_()

    """
    Input: src - pytorch tensor containing the input sequence for the model
    Description: forward pass of the model
    Output: tuple containing pytorch tensors representing reward and policy
    """
    def forward(self, src):
        src = self.encoder(src) * math.sqrt(self.ninp)
        src = self.pos_encoder(src)
        output = self.transformer_encoder(src) #Encoder memory
        output = self.gelu(output)
        output = self.decoder(output) #Linear layer
        output = self.gelu(output)
        output = self.flatten(output)
        v = self.v_output(output) #Value output
        v = self.softmax(v) #Get softmax probability
        p = self.p_output(output) #Policy output
        p = self.softmax(p) #Get softmax probability
        return v, p

    """
    Input: source - pytorch tensor containing data you wish to get batches from
           x - integer representing the index of the data you wish to gather
           y - integer representing the amount of rows you want to grab
    Description: Generate input and target data for training model
    Output: list of pytorch tensors containing input and target data [x,y]
    """
    def get_batch(source, x, y):
        data = torch.tensor([])
        v_target = torch.tensor([])
        p_target = torch.tensor([])
        for i in range(y):
            #Training data
            if len(source) > 0 and x+i < len(source):
                d_seq = source[x+i][:len(source[x+i])-4099]
                data = torch.cat((data, d_seq))
                #Target data
                v_seq = source[x+i][-3:]
                v_target = torch.cat((v_target, v_seq))
                p_seq = source[x+i][-4099:-3]
                p_target = torch.cat((p_target, p_seq))
        return data.reshape(min(y, len(source[x:])), len(source[0])-4099).to(torch.int64), v_target.reshape(min(y, len(source[x:])), 3).to(torch.float), p_target.reshape(min(y, len(source[x:])), 4096).to(torch.float)

"""
Encode input vectors with posistional data
"""
class PositionalEncoding(nn.Module):
    """
    Input: d_model - integer containing the size of the data model input
           dropout - integer representing the dropout percentage you want to use (Default=0.1) [OPTIONAL]
           max_len - integer representing the max amount of tokens in a input (Default=5000) [OPTIONAL]
    Description: Initailize positional encoding layer
    Output: None
    """
    def __init__(self, d_model, dropout=0.1, max_len=5000):
        super(PositionalEncoding, self).__init__()
        self.dropout = nn.Dropout(p=dropout)

        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0).transpose(0, 1)
        self.register_buffer('pe', pe)

    """
    Input: x - pytorch tensor containing the input data for the model
    Description: forward pass of the positional encoding layer
    Output: pytorch tensor containing positional encoded data (floats)
    """
    def forward(self, x):
        x = x + self.pe[:x.size(0), :]
        return self.dropout(x)

circuit = TransformerModel()
export(circuit, input_shape = [1,28,28])

params_path = os.path.join('kzg.params')

res = ezkl_lib.gen_srs(params_path, 17)
output_path = os.path.join('input.json')

data_path = os.path.join('input.json')

model_path = os.path.join('network.onnx')

res = ezkl_lib.forward(data_path, model_path, output_path)

with open(output_path, "r") as f:
    data = json.load(f)
    
# HERE WE SETUP THE CIRCUIT PARAMS 
# WE GOT KEYS 
# WE GOT CIRCUIT PARAMETERS 
# EVERYTHING ANYONE HAS EVER NEEDED FOR ZK 


pk_path = os.path.join('test.pk')
vk_path = os.path.join('test.vk')
circuit_params_path = os.path.join('circuit.params')
params_path = os.path.join('kzg.params')

res = ezkl_lib.setup(
        data_path,
        model_path,
        vk_path,
        pk_path,
        params_path,
        circuit_params_path,
    )

assert res == True
assert os.path.isfile(vk_path)
assert os.path.isfile(pk_path)
assert os.path.isfile(circuit_params_path)

# GENERATE A PROOF 
proof_path = os.path.join('test.pf')

res = ezkl_lib.prove(
        data_path,
        model_path,
        pk_path,
        proof_path,
        params_path,
        "poseidon",
        "single",
        circuit_params_path
    )

assert res == True
assert os.path.isfile(proof_path)

# VERIFY IT 

res = ezkl_lib.verify(
        proof_path,
        circuit_params_path,
        vk_path,
        params_path,
    )

assert res == True
print("verified")